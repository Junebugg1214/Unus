# Bind the server to port 5000 on all available interfaces
bind = "0.0.0.0:5000"

# Number of worker processes for handling requests
workers = 3

# Set a timeout of 30 seconds
timeout = 30

# Graceful timeout for shutdowns
graceful_timeout = 30

# Use a gevent worker class for better concurrency handling (optional)
# Uncomment the following line if using gevent
# worker_class = "gevent"

# Log access and errors to stdout and stderr
accesslog = "-"
errorlog = "-"

# Optional: Adjust log level for better detail (DEBUG, INFO, WARNING, ERROR, CRITICAL)
loglevel = "info"
