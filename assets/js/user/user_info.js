$(function () {
    //自定义验证
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value > 6) {
                return "昵称的长度在1-6位之间"
            }
        }
    })
    initUserInfo();

    //获取用户的基本信息
    var layer = layui.layer;
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                //为表单快速赋值  渲染页面
                form.val('formUserInfo', res.data);
            }
        })
    };
    //重置表单信息
    $("#btnReset").on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    })
    //提交表单事件 发起请求
    $(".layui-form").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                window.parent.getUserInfo();
            }
        })
    })
})