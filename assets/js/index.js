$(function () {
    getUserInfo();

    //退出功能
    var layer = layui.layer;
    $("#btnLogout").on('click', function () {
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
            //do something
            //删除本地存储
            localStorage.removeItem("token");
            //跳转页面
            location.href = '/login.html';
            layer.close(index);
        });
    })
})

//  请求用户信息和头像   一进入这个页面就发起请求 
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data);
        }
    })
}

//渲染页面
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $("#welcome").html("欢迎&nbsp,&nbsp" + name);
    //判断返回的信息是否有头像
    if (user.user_pic !== null) {
        //有头像  就把头像显示 出来  文本隐藏
        $(".layui-nav-img").attr('src', user.user_pic).show();
        $(".user-avatar").hide();
    } else {
        //没有头像就把图片隐藏  把用户名第一个字符转换为大写显示出来
        var first = name[0].toUpperCase();
        $(".layui-nav-img").hide();
        $(".user-avatar").html(first).show();
    }
}