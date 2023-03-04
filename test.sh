#!/bin/bash

for fn_name in $(grep -op '(?<=@Post\(\)\w+' src/auth/auth.controller.ts); do
  echo "Generating test file for $fn_name..."
done
