# Flowauto

Google Chrome Automation Executor

# Installation

```
npm install -g flowauto
```

# Usage

```
flowauto --userDataDir ./userDataDir --filepath ./flow.json
```

# Parameters
	•	userDataDir: Path to the browser cache data directory.
	•	filepath: Path to the task configuration file.

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