FROM tree_api_base

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY --chown=default . .

RUN chmod +x entrypoint.sh

USER default

ENTRYPOINT [ "/usr/src/app/entrypoint.sh" ]
