if [[ $COMMIT =~ ^feat:* ]]; then
    yarn version major
fi

if [[ $COMMIT =~ ^chore:* ]]; then
    yarn version minor
fi

if [[ $COMMIT =~ ^fix:* ]]; then
    yarn version patch
fi
