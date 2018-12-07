#/bin/bash

NAME=nanachi


if [[ "x$TMUX" == "x" ]]
then
    echo 'You should be running this inside tmux'
    echo 'Aborting, retry with tmux'
    exit 101
fi

if touch /root
then true
else
    echo 'This script should be run as root'
    echo 'Aborting, retry with `sudo -E bash`'
    exit 103
fi


dirname="/tmp/${NAME}-$(git rev-parse HEAD | head -c 8)"

if [[ "$(git status -s)" != "" ]]
then
    dirname+="-$RANDOM"
fi


if [[ -d "$dirname" ]]
then true
else
    mkdir "$dirname"
    cp -rv * "$dirname"
fi


cd "$dirname"

npm install

npm run serve
