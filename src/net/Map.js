// import URL from './URL.js'
// export default class kmap {
//     //通过用户id获取当前学期的课程列表
    // getCourseList_currentTerm1() {
    //     console.log('储相瑞-成功进入');
    //     let keymap = {
    //         method: 'GET',
    //         // headers: { 'interactionCourseID': '2' },
    //     };
    //     let URL='../test.json';
    //     console.log('arg', keymap)
    //     var promise = new Promise((resolve, reject) => {
    //         fetch(URL, keymap).then((result) => {
    //             result.json().then(
    //                 (resultData) => {
    //                     if (resultData != undefined && resultData.length > 0) {
    //                         console.log('储相瑞');
    //                         resolve(resultData);
    //                     } else {
    //                         console.log('储相瑞123');
    //                         resolve(undefined);
    //                     }
    //                 }
    //             ).catch(
    //                 (error) => {
    //                     reject(error);
    //                 }
    //                 )
    //         }).catch((err) => { reject(err) })

    //     })
    //     return promise;
    // }
//     //不使用 Promise
//     getCourseList_currentTerm() {
//         console.log('储相瑞-成功进入');
//         let keymap = {
//             method: 'GET',
//             // headers: { 'interactionCourseID': '2' },
//         };
//         let URL='../test.json';
//         console.log('arg', keymap)
//             fetch(URL, keymap).then((result) => {
//                 result.json().then(
//                     (resultData) => {
//                         if (resultData != undefined && resultData.length > 0) {
//                             console.log('储相瑞');
//                              return resultData;
//                         } else {
//                             console.log('储相瑞123');
//                             return undefined ;
//                         }
//                     }
//                 ).catch(
//                     (error) => {
//                         console.log('error'+error);
//                     }
//                     )
//             }).catch((err) => {console.log('err'+err); })

//     }
    
// }
let keymap = {
    method: 'GET',
    // headers: { 'interactionCourseID': '2' },
};
let URL='../test.json';
export const Kmap = () => fetch(URL,keymap).then((result) => {
    result.json().then(
        (resultData) => {
            if (resultData != undefined && resultData.length > 0) {
                console.log('储相瑞-成功');
                console.log('resultData');
                console.log(resultData);
                return resultData;
            } else {
                console.log('储相瑞123');
                return undefined ;
            }
        }
    ).catch(  
        (error) => {
            return error;
        }
        )
}).catch((err) => {  return err; });

















// componentDidMount() {
//     let str={"title" :"分数乘法", "knowcontent": "1.分数乘整数时","description": "分数","contribute": "bing", "keywords": "分数","language": "中文","applicability": "小学六年级","importance": 1,"difficulty": 2,"kcid1": 1,"kcid2": 4,"kcid3": 8,};
//     let keymap = {
//       method: 'GET',
//       //  headers: { 'uid': 1, 'kcid2': 4, 'kcid3': 8, 'version': 1, 'kmap_type': 1 },
//       headers: {  'Content-Type':'application/json;charset=UTF-8', }, 
//       // body: { 'uid': 1, 'kcid2': 4, 'kcid3': 8, 'version': 1, 'kmap_type': 1 }
//       // headers: {
//       //   "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
//       // },
//       // body:JSON.parse(str),JSON.stringify
//       // body:JSON.stringify({"title" :"分数乘法", "knowcontent": "1.分数乘整数时","description": "分数","contribute": "bing", "keywords": "分数","language": "中文","applicability": "小学六年级","importance": 1,"difficulty": 2,"kcid1": 1,"kcid2": 4,"kcid3": 8,}),
//       // body:JSON.stringify({ "uid": 1, "kcid2" :4, "kcid3": 8, "version": 1, "kmap_type": 1 }),
//       body:{'username':'xinlan'},
//     };
//     // let URL = '../test.json';
//     // let URL = '/knowledge_map/queryList';
//     let URL = '/user/getUserInfo';
//     // let URL = '/knowledge/addKnowledgeUnit';
//     fetch(URL, keymap).then((result) => {
//       result.json().then(
//         (resultData) => {
//           if (resultData != undefined && resultData.length > 0) {
//             console.log('储相瑞-成功');
//             console.log('resultData');
//             console.log(resultData);
//           } else {
//             console.log('储相瑞-失败');
//           }
//         }
//       ).catch(
//         (error) => {
//           return error;
//         }
//         )
//     }).catch((err) => { return err; });
//   }


               
       


