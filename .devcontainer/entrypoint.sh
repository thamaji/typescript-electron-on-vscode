#!/bin/bash
set -eu

# docker.sock から gid を取得して、docker グループの gid を変更
docker_group_id=$(ls -n /var/run/docker.sock | cut -d ' ' -f 4)
sudo groupmod --gid ${docker_group_id} docker

sudo /usr/bin/supervisord -c /etc/supervisor/supervisord.conf

sudo su --login vscode <<EOS
    export PATH=${PATH}
    export LANG=${LANG}

    unset SESSION_MANAGER
    unset DBUS_SESSION_BUS_ADDRESS

    export GTK_IM_MODULE=fcitx
    export QT_IM_MODULE=fcitx
    export XMODIFIERS=@im=fcitx
    export DefaultIMModule=fcitx
    /usr/bin/fcitx-autostart

    while true; do
        /usr/bin/startxfce4
    done
EOS
