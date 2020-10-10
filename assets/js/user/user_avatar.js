$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //2点击选择文件
    $("#btnChooseImage").on("click", function () {
        $("#file").click();
    })
    //为文件选择绑定选择事件 change   用户选择了文件就会出发这个事件
    $("#file").on("change", function (e) {
        // 通过 e.target.files 获取用户选择文件列表   是一个伪数组
        var files = e.target.files;
        if (files.length === 0) {
            return layui.layer.msg("请选择文件");
        }
        // 1 拿到用户选择的文件
        var file = e.target.files[0];
        // 2. 将文件，转化为路径
        var imgURL = URL.createObjectURL(file)
        // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //3 将裁剪后的图片上传到服务器  更新信息
    $(".layui-btn").on('click', function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串


        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL,
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg(res.message);
                width.parent.getUserInfo();
            }
        })
    })


    // 4 渲染默认头像
    // 渲染默认头像
    getUserInfo()
    function getUserInfo() {
        $.ajax({
            method: "GET",
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                //渲染用户信息头像
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', res.data.user_pic)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域
            },

        })
    }
})