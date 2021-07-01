FROM ubuntu:18.04 as devcontainer

RUN set -x \
    && sed -i.bak -r 's!(deb|deb-src) \S+!\1 mirror://mirrors.ubuntu.com/mirrors.txt!' /etc/apt/sources.list

RUN set -x \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
    && apt-get clean && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/*

RUN set -x \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        tzdata \
    && apt-get clean && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/* \
    && ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && echo 'Asia/Tokyo' >/etc/timezone

RUN set -x \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        language-pack-ja \
        language-pack-ja-base \
    && apt-get clean && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/*
ENV LANG=ja_JP.UTF-8

# vscode user
RUN set -x \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        sudo \
    && apt-get clean && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/* \
    && echo "vscode ALL=(ALL) NOPASSWD:ALL" >>/etc/sudoers.d/ALL \
    && groupadd \
        --gid 5000 \
        vscode \
    && useradd \
        --uid 5000 \
        --gid 5000 \
        --home-dir /home/vscode \
        --create-home \
        --shell /bin/bash \
        vscode

# supervisord
RUN set -x \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        supervisor \
    && apt-get clean && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/* \
    && { \
        echo '[supervisord]'; \
        echo 'user=root'; \
    } > /etc/supervisor/conf.d/supervisor.conf

# dbus
RUN set -x \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        dbus-x11 \
    && apt-get clean && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/* \
    && install -o root -g root -m 0755 -d /var/run/dbus \
    && { \
        echo "[program:dbus]"; \
        echo "command=/usr/bin/dbus-daemon --system --nofork --nopidfile"; \
    } > /etc/supervisor/conf.d/x11.conf

# xvfb
RUN set -x \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        xvfb \
    && apt-get clean && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/* \
    && install -o root -g root -m 0755 -d /var/run/dbus \
    && { \
        echo '[program:xvfb]'; \
        echo 'command=/usr/bin/Xvfb :0 -screen 0 1280x768x16'; \
    } > /etc/supervisor/conf.d/x11.conf
ENV DISPLAY=:0

# vnc server
RUN set -x \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        x11vnc \
    && apt-get clean && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/* \
    && { \
        echo '[program:x11vnc]'; \
        echo 'command=/usr/bin/x11vnc -noxrecord -noxfixes -noxdamage -xkb -forever -shared'; \
    } > /etc/supervisor/conf.d/x11vnc.conf
# EXPOSE 5900

# vnc web client
RUN set -x \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        tar \
    && apt-get clean && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/* \
    && mkdir /usr/local/noVNC \
    && curl -fsSL https://github.com/novnc/noVNC/archive/v1.1.0.tar.gz | tar -xz --strip-components=1 -C /usr/local/noVNC \
    && mkdir /usr/local/noVNC/utils/websockify \
    && curl -fsSL https://github.com/novnc/websockify/archive/v0.9.0.tar.gz | tar -xz --strip-components=1 -C /usr/local/noVNC/utils/websockify \
    && ln -s /usr/local/noVNC/vnc.html /usr/local/noVNC/index.html \
    && { \
        echo "[program:noVNC]"; \
        echo "command=/usr/local/noVNC/utils/launch.sh --vnc localhost:5900 --listen 8080"; \
    } > /etc/supervisor/conf.d/noVNC.conf
EXPOSE 8080

# desktop
RUN set -x \
    && apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        adwaita-icon-theme-full \
        at-spi2-core \
        exo-utils \
        fonts-noto-cjk \
        fonts-noto-color-emoji \
        xfce4 \
        xfce4-settings \
        xfce4-terminal \
    && apt-get purge -y \
        orage \
        pm-utils \
        xscreensaver* \
    && apt-get clean && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/* \
    && echo "startxfce4" > /etc/skel/.xsession
COPY --chown=vscode:vscode ./xfce4-panel.xml /home/vscode/.config/xfce4/xfconf/xfce-perchannel-xml/xfce4-panel.xml

# IME
RUN set -x \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        fcitx \
        fcitx-config-gtk \
        fcitx-frontend-all \
        fcitx-mozc \
        fcitx-ui-classic \
    && apt-get clean && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/*

# vscode extensions cache
# https://code.visualstudio.com/docs/remote/containers-advanced#_avoiding-extension-reinstalls-on-container-rebuild
RUN set -x \
    && mkdir -p /home/vscode/.vscode-server/extensions /home/vscode/.vscode-server-insiders \
    && chown -R vscode:vscode /home/vscode/.vscode-server /home/vscode/.vscode-server-insiders \
    && ln -s /home/vscode/.vscode-server/extensions /home/vscode/.vscode-server-insiders/extensions

# common tools
RUN set -x \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        bash-completion \
        curl \
        git \
        gnupg2 \
        iputils-ping \
        jq \
        less \
        net-tools \
        openssh-client \
        tar \
        time \
        unzip \
        xz-utils \
        zip \
    && apt-get clean && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/*

# docker
RUN set -x \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg-agent \
        software-properties-common \
    && curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add - \
    && add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        docker-ce-cli \
    && apt-get clean && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/* \
    && groupadd --gid 999 docker \
    && usermod -aG docker vscode

# docker compose
ARG COMPOSE_VERSION=1.27.4
RUN set -x \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
    && apt-get clean && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/* \
    && curl -fsSL "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
    && chmod +x /usr/local/bin/docker-compose \
    && curl -fsSL -o /etc/bash_completion.d/docker-compose "https://raw.githubusercontent.com/docker/compose/${COMPOSE_VERSION}/contrib/completion/bash/docker-compose"

# docker / docker-compose in devcontainer
RUN set -x \
    && mkdir -p /usr/local/devcontainer-tool/bin \
    && curl -fsSL -o /usr/local/devcontainer-tool/bin/docker https://github.com/thamaji/devcontainer-docker/releases/download/v1.0.1/docker \
    && chmod +x /usr/local/devcontainer-tool/bin/docker \
    && curl -fsSL -o /usr/local/devcontainer-tool/bin/docker-compose https://github.com/thamaji/devcontainer-compose/releases/download/v1.0.2/docker-compose \
    && chmod +x /usr/local/devcontainer-tool/bin/docker-compose
ENV PATH=/usr/local/devcontainer-tool/bin:${PATH}

# nodejs
ARG NODEJS_VERSION=v16.4.0
RUN set -x \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
    && apt-get clean && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/* \
    && mkdir -p /usr/local/lib/nodejs \
    && curl -fsSL "https://nodejs.org/dist/${NODEJS_VERSION}/node-${NODEJS_VERSION}-linux-x64.tar.xz" | tar xJ -C /usr/local/lib/nodejs
ENV PATH=/usr/local/lib/nodejs/node-${NODEJS_VERSION}-linux-x64/bin:${PATH}

# yarn
RUN set -x \
    && npm install --global yarn

# electron dependencies
RUN set -x \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        libgtk-3-dev \
        libxss1 \
        libnss3-dev \
        libasound2 \
    && apt-get clean && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/* 

# electron-packager dependencies
RUN set -x \
    && apt-get update \
    && apt-get install -y \
        wine64 \
    && apt-get clean && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/*

USER vscode

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT [ "bash", "-eu", "/entrypoint.sh" ]
