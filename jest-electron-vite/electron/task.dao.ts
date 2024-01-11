import Sqlite from "./data.sqlite";

export const saveTask = (id, filepath, taskdesc, taskurl) => {
  Sqlite.getInstance().run(`INSERT INTO jest_task VALUES ('${id}', '${filepath}', '${taskdesc}', '${taskurl}');`)
}

export const getAllTask = async () => {
  try {
    return  await Sqlite.getInstance().all(`SELECT * FROM jest_task;`)
  } catch (error) {
    return []
  }
}