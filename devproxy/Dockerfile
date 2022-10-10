FROM rockylinux:9

RUN yum update -y && yum install -y httpd && yum clean all

COPY devproxy.conf /etc/httpd/conf.d/
ENTRYPOINT ["/usr/sbin/httpd", "-DFOREGROUND"]