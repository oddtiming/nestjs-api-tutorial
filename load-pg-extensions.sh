#!/bin/sh

# https://gist.github.com/leopoldodonnell/b0b7e06943bd389560184d948bdc2d5b

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" << EOF
create extension pg_trgm;
select * FROM pg_extension;
EOF