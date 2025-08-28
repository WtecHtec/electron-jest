
const { BaseClient } = require('@lark-base-open/node-sdk');

const client = new BaseClient({
    appToken: '',
    personalBaseToken: ''
});

const TABLEID = ''
async function main() {
    // 查询记录
    // for await (const data of await client.base.appTableRecord.listWithIterator({
    //     params: {
    //         page_size: 20,
    //     },
    //     path: {
    //         table_id: TABLEID
    //     }
    // })) {
    //     console.log(data.items);
    // }

    client.base.appTableField.create({
		 data: {
            field_name:'文本2',
            type:1,
        },
         path: {
            table_id: TABLEID,
        }
	},
    ).then(res => {
        console.log(res);
    }).catch(e => {
        console.error(JSON.stringify(e.response.data, null, 4));
    });
}

main()
