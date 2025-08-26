FROM tree_api_base

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
RUN npm install -g jest

COPY --chown=default . .

USER default

RUN ["chmod", "+x", "./wait-for.sh"]

ENTRYPOINT [ "/usr/src/app/wait-for.sh", "http://api:8080/healthz" ]
