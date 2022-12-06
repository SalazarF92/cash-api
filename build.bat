aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 515660857956.dkr.ecr.us-east-1.amazonaws.com
docker build -t thecash .
docker tag thecash:latest 515660857956.dkr.ecr.us-east-1.amazonaws.com/thecash:latest
docker push 515660857956.dkr.ecr.us-east-1.amazonaws.com/thecash:latest