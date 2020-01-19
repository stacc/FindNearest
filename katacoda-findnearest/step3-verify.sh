export GOOGLE_API_KEY=yourapikey
if [ -z "$GOOGLE_API_KEY" ]; then
  echo "\$var variable is not set"
else
  echo "done"
fi
