#!/bin/bash

# Create the necessary files
	cd src/app/data &&	touch home_maintenance_tasks_status.json &&	touch home_maintenance_tasks.json && touch notepad.txt && touch misc_data.json


echo '{
    "periodicity": {
        "weekly": {
            "tasks": {}
        },
        "biweekly": {
            "tasks": {}
        },
        "monthly": {
            "tasks": {}
        },
        "bimonthly": {
            "tasks": {}
        },
        "quarterly": {
            "tasks": {}
        },
        "biannually": {
            "tasks": {}
        },
        "yearly": {
            "tasks": {}
        },
        "biennially": {
            "tasks": {}
        }
    },
    "season-specific": {
        "spring": {
            "tasks": {}
        },
        "summer": {
            "tasks": {}
        },
        "autumn": {
            "tasks": {}
        },
        "winter": {
            "tasks": {}
        }
    }
}' > home_maintenance_tasks.json

echo '{"completed_tasks": {}}' > home_maintenance_tasks_status.json

