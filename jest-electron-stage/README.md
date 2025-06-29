# Flowauto

Google Chrome Automation Executor

The task flow configuration data is more troublesome, so a desktop client is provided for free arrangement.
[app](https://github.com/WtecHtec/electron-jest/releases)

# Installation

```
npm install -g flowauto
```

# Usage

```
flowauto --userDataDir ./userDataDir --filepath ./flow.json --logpath ./logs
```

# Parameters
	•	userDataDir: Path to the browser cache data directory.
	•	filepath: Path to the task configuration file.
	•	logpath:  Path to the log  file.

# Task Configuration File

You can arrange tasks using a desktop application, export them as a JSON file, and then execute them with flowauto.

# Client Application

Example:

```
{
  "task": []
}
```

# Using Parameters

When arranging tasks, if you choose to input parameters, you need to record the parameter names. While executing flowauto, pass these parameters using the --param1 value1 --param2 value2 format.

Example:

```
flowauto --userDataDir ./userDataDir --filepath ./flow.json --param1 value1 --param2 value2
```

# Support node

```
const flowauto = require('flowauto/task.run')

flowauto({
	userDataDir,
	filepath,
	logpath
})
```

#  Support keyboard

✅ Support 2025-06-14
	1.	Custom Hotkey Trigger
	2.	Task Parameters:
  	•	--taskparamfile: JSON file path
```
--taskparamfile ./taskparam.json 
```
•	--taskparam: JSON string content
```
--taskparam "{\"FriendName\":\"霜月初十\",\"Message\":\"Happy New Year\"}"

```
