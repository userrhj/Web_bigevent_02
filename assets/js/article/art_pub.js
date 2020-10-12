$(function () {
    // 1 渲染筛选的下拉列表
    // 2 初始化富文本编辑器
    // 3  图片裁剪效果
    // 4 为选择封面的按钮绑定点击事件
    // 5 绑定用户选择文件  change 获取用户选择的文件
    // 6 发布文章  设置状态 绑定点击事件
    // 7 绑定表单提交事件
    // 8 发起ajax请求，渲染页面
    var form = layui.form;
    var layer = layui.layer;
    initCate();
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                var htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                form.render();
            }
        })
    }

    // 2.1 初始化富文本编辑器
    initEditor()
    // 3.1 图片裁剪效果
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    $("#btnChooseImage").on('click', function () {
        $("#coverFile").click();
    })
    $("#coverFile").on('change', function (e) {
        var files = e.target.files
        if (files.length == 0) {
            return layer.msg("请选择文件");
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    var state = "已发布";
    $("#btnSave2").on('click', function () {
        state = "草稿";
    })
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(this);
        fd.append("state", state);
        // 将裁剪后的图片，输出为文件 放到formdata对象中
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                //发起ajax请求
                publishArticle(fd);
            })
    })
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg("恭喜您，发布文章成功，跳转页面中~");
                setTimeout(function () {
                    window.parent.document.querySelector("#art_list").click();
                }, 1000)

            }
        })
    }

})