const { BaseClient } = require('@lark-base-open/node-sdk');
class FeishuBaseTable {
    // 初始化
    constructor(appToken, personalBaseToken, tableId) {
        this.appToken = appToken
        this.personalBaseToken = personalBaseToken
        this.tableId = tableId
        this.client = null
    }

    // 初始化表格
    async initTable() {
        const { appToken, personalBaseToken, tableId } = this
        this.client = new BaseClient({
            appToken: appToken,
            personalBaseToken: personalBaseToken
        });
    }

    waitForTime(time=2) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, time * 1000)
        })
    }

    // 创建表格字段
    async createTableFields(fields) {
        const { client, tableId } = this
        if (!client) {
            await this.initTable()
        }
        if (!Array.isArray(fields)) {
            throw new Error('fields must be an array')
        }
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i]
            await this.client.base.appTableField.create({
                data: {
                    field_name: field,
                    type: 1,
                },
                path: {
                    table_id: tableId,
                }
            })
            await this.waitForTime()
        }
    }

    // 批量创建记录
    async batchCreateRecord(records) {
        const { client, tableId } = this
        if (!client) {
            await this.initTable()
        }
        if (!Array.isArray(records)) {
            throw new Error('records must be an array')
        }
        return await this.client.base.appTableRecord.batchCreate({
            data: {
                records,
            },
            path: {
                table_id: tableId,
            }
        })
    }

}

module.exports = FeishuBaseTable