let RealmBase = {};

import Realm from 'realm';

const HomeData = {
    name: 'HomeData',
    properties: {
        id: 'int',
        title: 'string',
        image: 'string',
        mall: 'string',
        pubtime: 'string',
        fromsite: 'string',
    }
}

const HtData = {
    name: 'HtData',
    properties: {
        id: 'int',
        title: 'string',
        image: 'string',
        mall: 'string',
        pubtime: 'string',
        fromsite: 'string',
    }
}

//初始化realm
let realm = new Realm({ schema: [HomeData, HtData] });

//添加
RealmBase.create = function (schema, data) {
    realm.write(() => {
        for (let i = 0; i < data.length; i++) {
            let temp = data[i];
            realm.create(schema, { id: temp.id, title: temp.title, image: temp.image, mall: temp.mall, pubtime: temp.pubtime, fromsite: temp.pubtime });
        }
    });
}

//查询全部数据
RealmBase.loadAll() = function (schema) {
    return realm.objects(schema);
}

RealmBase.filtered = function (schema, filtered) {
    //获取对象
    let objects = realm.objects(schema);
    //筛选
    let object = objects.filtered(filtered);
    if (object) {    //找到数据
        return object;
    } else {
        return 'No found data';
    }
}

RealmBase.removeAll = function (schema) {
    realm.write(() => {
        //获取对象
        let objects = realm.objects(schema);
        //删除表
        realm.delete(objects);
    });
}

global.RealmBase = RealmBase;