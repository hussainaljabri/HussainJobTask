import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('hussaintask.db');

// var fields = {
//     user: ["user_id", "firstname", "lastname", "username", "password"], // admin or employee
//     requests: ["request_id", "user_id", "title", "message"],
//     requests_files: ["file_id", "request_id", "file_path" ],
// }


var initalize = function (callback){
    var query;
    // Enables Foreign Keys
    db.transaction(function(tx) {
        tx.executeSql('PRAGMA foreign_keys=ON', [], (tx) => { createTables(callback); } );
    });
    // Creates the Tables
    var createTables = function(callback){
        // user table
        query = `CREATE TABLE if not exists User (id integer primary key not null unique, firstname text, lastname text, username text, password text)`;
        _sqlQuery(query, [], {success:(tx, res)=>{
            console.log('----- Created User table -----');
            // requests table
            query = `CREATE TABLE if not exists Requests (id integer primary key not null unique, user_id integer REFERENCES User(id), title text, message text)`;
            _sqlQuery(query,[],{
                success: (tx, res) =>{
                    console.log('----- Created Requests table -----');
                    // requests files table
                    query = `CREATE TABLE if not exists Files (id integer primary key not null unique, request_id integer REFERENCES Requests(id), path text)`;
                    _sqlQuery(query,[],{
                        success: (tx, res) =>{
                            console.log('----- Created Files table -----');
                            callback.success();
                        }
                    },tx);
                }
            },tx);
        }}, null);
    }

}
// Drop the tables
var destroyDatabase = function(callback){
    _sqlQuery(`DROP TABLE if exists User`, [], {
        success: (tx, res) =>{
            _sqlQuery(`DROP TABLE if exists Requests`, [], {
                success: (tx, res) =>{
                    _sqlQuery(`DROP TABLE if exists Files`, [], {
                        success: (tx, res)=>{
                            console.log("...Dropped all Database Tables...");
                            callback.success();
                        }
                    }, tx)
                }
            }, tx)
        }
    }, null);
}

var printTable = function(){
    var query = `SELECT * FROM User`;
    _sqlQuery(query, [],{
        success: (tx, res)=>{
            console.log(`----------------------------------- User START ------------------------------------------------`);
            // console.log(res.rows._array);
            console.log(res);
            console.log(`----------------------------------- User END---------------------------------------------------`);
            _sqlQuery(`SELECT * FROM Requests`, [], {
                success: (tx, res)=>{
                    console.log(`----------------------------------- Requests START ------------------------------------------------`);
                    // console.log(res.rows._array);
                    console.log(res);
                    console.log(`----------------------------------- Requests END---------------------------------------------------`);
                    _sqlQuery(`SELECT * FROM Files`, [], {
                        success: (tx, res) => {
                            console.log(`----------------------------------- Files START ------------------------------------------------`);
                            // console.log(res.rows._array);
                            console.log(res);
                            console.log(`----------------------------------- Files END---------------------------------------------------`);
                        }
                    }, tx)
                }
            }, tx)
        },
        error: ()=> {
            console.log('error happened at printTable');
        }
    }, null);
}


var addUser = function(firstname, lastname, username, password, callback){
    var query = `INSERT INTO User (id, firstname, lastname, username, password ) VALUES (?, ?, ?, ?, ?)`;
    _sqlQuery(query, [null, firstname, lastname, username, password], {
        success: ()=> callback.success(),
        error: ()=> callback.error(),
    }, null);
}
var getUser = function(username, password, callback){
    var query = `SELECT * FROM User WHERE username=? AND password=? `;
    _sqlQuery(query, [username, password], {
        success: (tx, res)=>{
            console.log('Login Result: ' + JSON.stringify(res.rows));
            if(res.rows.length <= 0){
                callback.error("لا يوجد حساب مسجل, الرجاء التقدم بالتسجيل");
            }else{
                var result = res.rows._array[0];
                console.log('Passing Login cred: '+ JSON.stringify(res.rows._array[0]));
                callback.success(result);
                
            }
        },
        error: ()=>{
            callback.error("حدث خطأ خلال سحب بياناتك, الرجاء المحاولة مرة اخرى");
        }
    }, null);
    

}

// User: id integer primary key not null unique, firstname text, lastname text, username text, password text
// Requests: id integer primary key not null unique, user_id integer REFERENCES User(id), title text, message text)
var getAllUsersWithRequests = function (callback){
    var query = `SELECT Requests.id, Requests.user_id, Requests.title, Requests.message, User.firstname, User.lastname, User.username FROM Requests `;
    query += `INNER JOIN User ON Requests.user_id = User.id;`;
    // var query=`SELECT Requests.id, Requests.user_id, Requests.title, Requests.message FROM Requests UNION SELECT User.firstname, User.lastname, User.username FROM User`;
    //var query =`SELECT Requests.id as requestid FROM Requests INNER JOIN User ON User.id = Requests.user_id `;
    _sqlQuery(query, [], {
        success: (tx, res)=> callback.success(res.rows._array),
        error: ()=> console.log('Error'),
    }, null);

}

var addRequest = function(title, msg, userid, callback){
    var query = `INSERT INTO Requests (id, user_id, title, message ) VALUES (?, ?, ?, ?)`;
    if(userid == null){
        callback.error();
    }else{
        _sqlQuery(query, [null, userid, title, msg], {
            success: (tx, res)=> callback.success(res.insertId),
            error: ()=> callback.error(),
        }, null);
    }
}
var EditRequest = function(id,title, msg, callback){
    var query = `UPDATE Requests SET title=?, message=? WHERE id=${id}`;
    _sqlQuery(query, [title, msg], {
        success: (tx, res)=>{
            callback.success();
        },
        error: ()=>{
            callback.error("حدث خطأ خلال التحديث, الرجاء المحاولة مرة اخرى");
        }
    }, null);
    

}
var DeleteRequest = function(id, callback){
    
    var query = `DELETE FROM Requests WHERE id=?`;
    _sqlQuery(query, [id], {
        success: (tx, res)=>{
            query = `DELETE FROM Files where request_id=?`;
            _sqlQuery(query,[id], {
                success: ()=> callback.success(),
                error: (msg)=> {
                    console.log(msg);
                    callback.error();
                }
            }, tx)
        },
        error: ()=>{
            callback.error("حدث خطأ خلال التحديث, الرجاء المحاولة مرة اخرى");
        }
    }, null);
    

}
var getRequest = function(userid, callback){
    var query = `SELECT * FROM Requests WHERE user_id=?`;
    _sqlQuery(query, [userid], {
        success: (tx, res)=>{
            console.log('res: ' + JSON.stringify(res.rows));
            if(res.rows.length <= 0){
                callback.error("لا يوجد اقتراح لهذا الحساب, الرجاء التقدم بإقتراح");
            }else{
                var result = res.rows._array;
                console.log(res.rows._array);
                if(res.rows.length > 0){
                    callback.success(result);
                }else{
                    callback.error("لا يوجد اقتراح");
                }
            }
        },
        error: ()=>{
            callback.error("حدث خطأ خلال سحب بياناتك, الرجاء المحاولة مرة اخرى");
        }
    }, null);
    

}


var addFiles = function(request_id, path , callback){
    var query = `INSERT INTO Files (id, request_id, path) VALUES (?, ?, ?)`;
    if(request_id == null){
        callback.error('Request ID is Null');
    }else{
        _sqlQuery(query, [null, request_id, path], {
            success: ()=> callback.success(),
            error: ()=> callback.error('Error during SQL query.'),
        }, null);
    }
}
var getFiles = function(request_id, callback){
    var query = `SELECT * FROM Files WHERE request_id=?`;
    _sqlQuery(query, [request_id], {
        success: (tx, res)=>{
            console.log('res: ' + JSON.stringify(res.rows));
            if(res.rows.length <= 0){
                callback.error("لا يوجد مرفق لهذا الاقتراح.");
            }else{
                var result = res.rows._array;
                console.log(res.rows._array);
                if(res.rows.length > 0){
                    callback.success(result);
                }else{
                    callback.error("لا يوجد مرفقات");
                }
            }
        },
        error: ()=>{
            callback.error("حدث خطأ خلال سحب بياناتك, الرجاء المحاولة مرة اخرى");
        }
    }, null);
    

}

var deleteFile = function(id, callback){
    var query = `DELETE FROM Files where id=?`;
    _sqlQuery(query, [id],{
        success:(tx, res)=>{
            callback.success();
        },
        error: ()=> callback.error()
    }, null);
}
var deleteFileByPath = function(path, callback){
    var query = `DELETE FROM Files where path=?`;
    _sqlQuery(query, [path],{
        success:(tx, res)=>{
            callback.success();
        },
        error: ()=> callback.error()
    }, null);
}

//param query    --> sqlite query
//param params   --> if values in query are represented as '?' they will be filled in in order by the params array.
//                   this is the only way queries can be "built". If no params pass empty array.
//param callbacks--> json object {success: successFunction(tx,res); error: errorFunction(tx)}
//                   either callback may be passed optionally as well as their parameters. Function is async though so will usually need success
//param tx       --> use if this invocation is a callback intended to use the same connection
var _sqlQuery = function (query, params, callbacks, tx) {
    var success = (!callbacks || !callbacks.success) ? function(tx,res) { return res; } : callbacks.success;
    var error = (!callbacks || !callbacks.error) ? function(err) {
        console.log("----Error With Query----\n" + query);
        console.log("Params - ");
        if (params.length !== 0) {
            for (var i = 0; i < params.length; i++)
                console.log(params[i]);
        } else console.log("None");
    } : callbacks.error;

    if (tx) {
        tx.executeSql(query, params, success, error);
        return;
    }

    db.transaction(function(tx) {
        tx.executeSql(
            query,
            params,
            success,
            error
        );
    });
}



const database = {
    initalize: initalize,
    destroyDatabase: destroyDatabase,
    printTable: printTable,

    addUser: addUser,
    getUser: getUser,
    getAllUsersWithRequests: getAllUsersWithRequests,
    addRequest: addRequest,
    getRequest: getRequest,
    EditRequest:EditRequest,
    DeleteRequest: DeleteRequest,

    addFiles: addFiles,
    getFiles: getFiles,
    deleteFile: deleteFile,
    deleteFileByPath: deleteFileByPath

}
export default database;