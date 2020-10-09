$(function () {
    //开发服务器地址
    var baseURl = 'http://ajax.frontend.itheima.net';
    //测试环境服务器地址
    // var baseURl = 'http://ajax.frontend.itheima.net';
    //生产环境服务器地址
    // var baseURl = 'http://ajax.frontend.itheima.net';


    //在发起ajax请求前，调用这个函数统一拼接请求的根路径
    $.ajaxPrefilter(function (options) {
        if (options.url.indexOf('/my/') !== -1) {
            options.headers = {
                Authorization: localStorage.getItem('token') || ''
            }
        }


        options.url = baseURl + options.url


        // 统一挂载complete函数
        options.complete = function (res) {
            // console.log(res);
            // 判断返回信息 是否认证失败  失败就删除本地存储并且页面跳转
            if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
                //删除本地存储
                localStorage.removeItem('token');
                //页面跳转
                location.href = '/login.html';
            }
        }
    })



})