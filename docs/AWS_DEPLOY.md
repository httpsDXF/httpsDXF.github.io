# Host the Django API on AWS (Elastic Beanstalk)

This guide deploys the `backend/` app to **AWS Elastic Beanstalk** (managed EC2 + load balancer) with **RDS PostgreSQL** for the database and **S3** for uploaded media (blog images/videos). Your static site (GitHub Pages) keeps using `NEXT_PUBLIC_API_URL` pointing at the Beanstalk URL (or a custom domain).

## Prerequisites

- AWS account
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and [EB CLI](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html): `pip install awsebcli`
- IAM user with permissions to create EB environments, RDS, S3, IAM roles (or use the AWS console)

## 1. RDS (PostgreSQL)

1. **RDS** → **Create database** → **Standard create** → **PostgreSQL** (e.g. 16).
2. **Templates**: Dev/Test is enough to start.
3. **DB instance identifier**: e.g. `httpsdxf-db`.
4. **Master username / password**: save these securely.
5. **Instance class**: `db.t4g.micro` or `db.t3.micro` for low traffic.
6. **Storage**: General purpose, 20 GiB is fine.
7. **Connectivity**:
   - **VPC**: same region you will use for Elastic Beanstalk.
   - **Public access**: optional (if you only connect from EB, use private + security groups).
   - Create a **security group** that allows **inbound PostgreSQL (5432)** from the **Elastic Beanstalk instance security group** (after EB exists, edit RDS security group to allow SG of EB instances).
8. After creation, copy the **endpoint** (e.g. `httpsdxf-db.xxxx.us-east-1.rds.amazonaws.com`).

**Connection string** for `DATABASE_URL` (replace values):

```text
postgresql://USER:PASSWORD@endpoint:5432/postgres?sslmode=require
```

Use the database name you created (often `postgres` initially, or create a DB named `httpsdxf` in RDS and use that in the path).

## 2. S3 (media uploads)

1. **S3** → **Create bucket**.
2. Name: e.g. `httpsdxf-media-YOURACCOUNT` (globally unique).
3. Region: same as EB/RDS.
4. **Block Public Access**: keep **on** (recommended). The app uses **signed URLs** / IAM role access; for public blog images you can later add a bucket policy for `GetObject` on a prefix or put **CloudFront** in front.
5. Note **bucket name** and **region**.

## 3. IAM role for the EB instances (S3)

1. **IAM** → **Roles** → find the role attached to your EB environment (e.g. `aws-elasticbeanstalk-ec2-role` or the role created by EB).
2. **Add permissions** → **Create inline policy** (JSON), e.g.:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "BlogMediaBucket",
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::YOUR_BUCKET_NAME",
        "arn:aws:s3:::YOUR_BUCKET_NAME/*"
      ]
    }
  ]
}
```

Replace `YOUR_BUCKET_NAME`. Attach this policy to the **EC2 instance role** used by Elastic Beanstalk (not only the EB service role).

## 4. Elastic Beanstalk environment

1. Install EB CLI, then from the **`backend`** directory (where `manage.py` lives):

   ```bash
   cd backend
   eb init -p python-3.12 httpsdxf-api --region us-east-1
   ```

   Choose the correct region.

2. Create the environment (first deploy):

   ```bash
   eb create httpsdxf-api-prod --single
   ```

   `--single` uses one instance (cheaper; no load balancer auto-scaling). For production with HTTPS at the edge, you can switch to a load-balanced profile later.

3. When the environment is **green**, open **Configuration** → **Software** → **Environment properties** and set:

   | Name | Example / notes |
   |------|-----------------|
   | `DJANGO_SECRET_KEY` | Long random string (`openssl rand -hex 32`) |
   | `DJANGO_DEBUG` | `false` |
   | `DJANGO_ALLOWED_HOSTS` | `your-env.elasticbeanstalk.com`, and your API domain if any |
   | `DJANGO_CORS_ORIGINS` | `https://httpsdxf.github.io`, `https://YOURDOMAIN.com` (no trailing slash) |
   | `DJANGO_CSRF_TRUSTED_ORIGINS` | `https://your-env.elasticbeanstalk.com` (and custom API domain) |
   | `DATABASE_URL` | `postgresql://user:pass@rds-endpoint:5432/dbname?sslmode=require` |
   | `AWS_STORAGE_BUCKET_NAME` | Your S3 bucket name |
   | `AWS_S3_REGION_NAME` | e.g. `us-east-1` |
   | `AWS_DEFAULT_REGION` | Same as above (helps boto3) |

   Optional:

   - `DJANGO_SECURE_SSL_REDIRECT` = `true` once HTTPS works end-to-end (default in settings is `false` to avoid redirect loops while debugging).

4. **Security**: ensure the **EB environment’s EC2 security group** can **outbound** to RDS (5432) and that **RDS** allows **inbound 5432** from the EB instances’ security group.

5. Redeploy after changing env vars:

   ```bash
   eb deploy
   ```

## 5. First deploy checklist

- [ ] RDS reachable from EB (security groups).
- [ ] `DATABASE_URL` correct; migrations run (`eb logs` or EB **Logs** if migrate fails).
- [ ] `collectstatic` runs (admin CSS via WhiteNoise).
- [ ] `DJANGO_CORS_ORIGINS` includes your real frontend origin(s).
- [ ] Create a Django superuser (SSH/SSM into the instance or run a one-off `eb ssh` + `python manage.py createsuperuser`).

## 6. Frontend (GitHub Pages)

In the frontend build (or GitHub Actions secrets), set:

```bash
NEXT_PUBLIC_API_URL=https://your-env.elasticbeanstalk.com
```

Redeploy the site. The API must use HTTPS for production browsers if the site is HTTPS (CORS origins must match).

## 7. Custom domain + HTTPS for the API (optional)

- In **ACM** (Certificate Manager), request a certificate for `api.yourdomain.com` (DNS validation).
- Add an **Application Load Balancer** listener for HTTPS (or use EB’s **Load balancer** configuration with the certificate).
- Point **Route 53** (or your DNS) `api.yourdomain.com` to the load balancer / EB endpoint.

## Troubleshooting

- **502 Bad Gateway**: check `eb logs`; often Gunicorn crash (missing env, DB connection failure).
- **Database connection errors**: verify `DATABASE_URL`, security groups, and RDS “Public access” vs private-only rules.
- **Uploads fail**: verify S3 bucket name, region, and IAM policy on the **instance** role.
- **CORS errors**: add exact frontend origin to `DJANGO_CORS_ORIGINS` (scheme + host + port, no path).

## Alternative: single EC2

If you prefer a single **EC2** instance without Elastic Beanstalk, install Python 3.12, nginx, Gunicorn, use **systemd** to run Gunicorn, point nginx to `127.0.0.1:8000`, and reuse the same `DATABASE_URL`, S3, and environment variables. EB is less manual for updates and health checks.
