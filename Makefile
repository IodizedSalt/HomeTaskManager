build:
	docker build . -t christopher/homemaintenance

#	NAME=homemaint
#if [($(shell docker ps -a --format "{{.Names}}" ${NAME} 2> /dev/null) = homemaint)] 
#	docker stop homemaint && docker rm homemaint
	#docker run -p 49160:8000 --name homemaint -d christopher/homemaintenance
#else 
	#docker run -p 49160:8000 --name homemaint -d christopher/homemaintenance
#endif

clean:
	docker stop homemaint && docker rm homemaint

run:
	docker run -v ~/Workspace/HomeMaintenance/src/app/data:/src/app/data -p 49160:8000 --restart unless-stopped --name homemaint -d christopher/homemaintenance

update:
	docker stop homemaint && docker rm homemaint
	docker build . -t christopher/homemaintenance
	docker run -v ~/Workspace/HomeMaintenance/src/app/data:/src/app/data -p 49160:8000 --restart unless-stopped --name homemaint -d christopher/homemaintenance


init
	cd src/app/data
	touch home_maintenance_tasks_status.json
	touch home_maintenance_tasks_.json
	touch notepad.txt
	touch misc_data.json

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
			}
            "autumn": {
				"tasks": {}
			}
            "winter": {
				"tasks": {}
			}
        }
}' >> home_maintenance_tasks_.json

echo '{"completed_tasks": {}}' >> home_maintenance_tasks_status.json