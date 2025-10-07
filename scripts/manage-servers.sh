#!/bin/bash

# Hathak Platform Server Manager
# Usage: ./manage-servers.sh [start|stop|restart|status|clean]

echo "========================================"
echo "    HATHAK PLATFORM SERVER MANAGER"
echo "========================================"

check_status() {
    echo ""
    echo "=== SERVER STATUS ==="
    
    # Check port 3000 (Frontend)
    if lsof -i :3000 >/dev/null 2>&1; then
        echo "Frontend (Next.js): RUNNING on port 3000"
    else
        echo "Frontend (Next.js): NOT RUNNING"
    fi
    
    # Check port 5000 (Backend)
    if lsof -i :5000 >/dev/null 2>&1; then
        echo "Backend (Express): RUNNING on port 5000"
    else
        echo "Backend (Express): NOT RUNNING"
    fi
    
    # Count Node processes
    node_count=$(pgrep -f node | wc -l)
    echo "Total Node.js processes: $node_count"
}

start_servers() {
    echo ""
    echo "=== STARTING SERVERS ==="
    
    # Stop existing servers first
    stop_servers
    
    echo "Starting Backend (Express) on port 5000..."
    cd backend && npm start &
    BACKEND_PID=$!
    
    echo "Waiting 3 seconds for backend to start..."
    sleep 3
    
    echo "Starting Frontend (Next.js) on port 3000..."
    cd ../frontend && npm run dev &
    FRONTEND_PID=$!
    
    echo ""
    echo "Servers started!"
    echo "Backend: http://localhost:5000"
    echo "Frontend: http://localhost:3000"
    echo "Backend PID: $BACKEND_PID"
    echo "Frontend PID: $FRONTEND_PID"
}

stop_servers() {
    echo ""
    echo "=== STOPPING SERVERS ==="
    
    # Kill processes on specific ports
    lsof -ti :3000 | xargs kill -9 2>/dev/null
    lsof -ti :5000 | xargs kill -9 2>/dev/null
    
    echo "Servers stopped."
}

clean_all() {
    echo ""
    echo "=== CLEANING ALL NODE.JS PROCESSES ==="
    echo "WARNING: This will stop ALL Node.js applications!"
    read -p "Are you sure? (y/N): " confirm
    
    if [[ $confirm == [yY] ]]; then
        pkill -f node
        echo "All Node.js processes killed."
    else
        echo "Operation cancelled."
    fi
}

case "$1" in
    start)
        start_servers
        ;;
    stop)
        stop_servers
        ;;
    restart)
        stop_servers
        sleep 2
        start_servers
        ;;
    status)
        check_status
        ;;
    clean)
        clean_all
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|clean}"
        echo ""
        echo "Commands:"
        echo "  start   - Start both frontend and backend servers"
        echo "  stop    - Stop both servers"
        echo "  restart - Restart both servers"
        echo "  status  - Check server status"
        echo "  clean   - Kill all Node.js processes"
        exit 1
        ;;
esac
