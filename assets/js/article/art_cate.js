$(function () {
    var layer = layui.layer;
    initArtCateList();
    var indexAdd = null;
    // 2 点击添加类别 弹出弹出层
    $("#btnAdd").on("click", function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $("#dialog-add").html(),
            area: ['500px', '260px'],
        });
    })
    // 添加类别，渲染列表
    $('body').on("submit", "#form-add", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                initArtCateList();
                layer.close(indexAdd);
            }
        })
    })
    // 3 点击编辑分类 弹出弹出层 渲染数据
    var indexEdit = null;
    var form = layui.form;
    $("tbody").on("click", ".btn-edit", function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            content: $("#dialog-edit").html(),
            area: ['500px', '260px'],
        });
        var Id = $(this).attr("data-id");
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + Id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                form.val("form-edit", res.data);
            }
        })
    })

    // 编辑修改数据 发起请求  渲染数据
    $("body").on("submit", "#form-edit", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }

                layer.msg(res.message);
                layer.close(indexEdit);
                initArtCateList();

            }
        })
    })
    //4 点击删除分类 弹出弹框 确定发起请求 渲染页面
    $("tbody").on("click", ".btn-delete", function () {
        var id = $(this).attr("data-id");
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: "GET",
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    initArtCateList();
                }
            })
            layer.close(index);
        });
    })



    // 封装初始化 渲染列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                var htmlStr = template("tpl-table", res);
                $('tbody').html(htmlStr);
            }
        })
    }
})