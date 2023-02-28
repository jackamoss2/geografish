# Project Name
The app will be named GeograFish- based on the Dutch word for geographic; geografisch. The logo/theme, if developed, be fish-based.
# Project Overview
The app will use ArcGIS API for JavaScript, leveraged to allow users to create and share basic web-based maps. Users will be able to upload data, set basic map display characteristics, and share the map via URL. This will allow for a more dynamic process to collaboratively reviewing GIS data, as opposed to printing static PDFs or screen sharing a desktop app interface.
# Features
The below feature list is not intended to be completed during the capstone project.
- The main feature is the ability to upload data and set basic map properties;
    - load-up view
    - data stylizing/annotation
    - user privelages
- Store GIS data (not intended use, but necessary for function)
- Download data from map
- Print PDF of map
- User accounts with a list of created/viewed maps
- Allow for multiple data types to be loaded, starting with only GeoJSON
- Allow for exported CAD designs to be displayed in 3D
- Provide ability for mutliple users to interact with eachother while viewing data
- Standardize coordinate system/geospatial reference if imported data does not match to map base
# User Stories
"As a junior civil engineer, I want to be able to easily share a dynamic view of the project GIS data with the senior engineer."
##### Tasks:
- Upload data
- Live interaction to invetigate data
- Create shareable URL
"As a senior engineer, I want to be able to quickly access the project GIS data to more quickly respond to questions from the contractor/junior engineer."
##### Tasks:
- Active project list under user profile
- Access permission to allow outside sources to view but not modify the map
"As a project manager, I want to be able to effectively communicate design considerations with the design team concerning GIS data."
##### Tasks:
- Ability to load multiple types of data from different sources
- Allow for multiple users to view the map simultaneously, and show mouse/selection to all users
# Data Model
- GIS data stored as GeoJSON
- Map properties
- Users
# Schedule
### Milestone 1, MVP, estimated 40 hours
Basic user system, allowing for a user to create a map with a unique URL, which accesses respective data stored in the database. User profile will list created maps. The map will be available for anyone to view. Data will be uploaded as GeoJSON, and will be capped to a fairly small data limit. Maps and data will be displayed only in top-down view.
### Milestone 2, estimated 40 hours
Allow for map characteristics to be modified and saved, such as load-up view and data display customization. Add functionality for map creator to set privaliges, allowing certain users to view or modify the map. Allow viewers to download data.
### Milestone 3, estimated 40 hours
Increase upload data limit, and impliment data display limitations based on browser capacity. Add functionality for multiple users to interact in the same map.
### Milestone 4, estimated eternity
All other features listed in features list

# End of submitted proposal

revised schedule:
### Milestone 1: MVP, cloud data
- Functional data, map, display models
- user system, with profiles and published maps
- interactive display capable of sufficient visual customization
- only geojson
- webpage styling
- code to handle excessively large data upload; require user to zoom until reasonable
- allow data to be uploaded as csv, shp, others?
### Milestone 2: share local data
- allow user to "host" map session
    - additional user session requests data from host thru server, server does not cache data
- show user selection, allow user to shift-click(?) and project red circle to others, drag to size circle
### Milestone 3:
- allow user to set up links to files saved on harddrive, internal server
    - ex: project files on office server
    - allows for milestone 2 sharing local data

