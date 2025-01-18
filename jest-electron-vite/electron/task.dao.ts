import Sqlite from "./data.sqlite";

export const saveTask = (id, filepath, taskdesc, taskurl, taskparam) => {
  console.log('saveTask taskparam---', taskparam)
  deleteTask(id)
  Sqlite.getInstance().run(`INSERT INTO jest_task VALUES ('${id}', '${filepath}', '${taskdesc}', '${taskurl}', '${taskparam}');`)
}

export const getAllTask = async () => {
  try {
    return  await Sqlite.getInstance().all(`SELECT * FROM jest_task;`)
  } catch (error) {
    return []
  }
}

export const deleteTask = (id) => {
  Sqlite.getInstance().run(`DELETE FROM jest_task WHERE id = '${id}';`)
}


export const saveTaskParam = (id, param) => {
  Sqlite.getInstance().run(`UPDATE jest_task SET taskparam = '${param}' WHERE id = '${id}';`)
}