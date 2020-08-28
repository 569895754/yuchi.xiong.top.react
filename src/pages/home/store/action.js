import {
    Blogs
} from '@/utils/api';
import RetureCode from '@/utils/return-code';
import history from '@/utils/history';
import {
    UPDATE_LIST,
    UPDATE_ITEM,
    ADD_ITEM
} from './constants';


// * 拉取博客列表
const fetchBlogList = (list, total) => ({
    type: UPDATE_LIST,
    list,
    total
});

const getBlogs = page => {
    return dispatch => {
        return Blogs.index(page).then(res => {
            if (res) {
                dispatch(fetchBlogList(res.data.blogs, res.data.total));
            }
        });
    };
};

// * 拉取某一篇博客
const fetchBlog = blog => ({
    type: UPDATE_ITEM,
    blog
});

const getBlog = id => {
    return dispatch => {
        return Blogs.show(id).then(res => {
            if (res.data.code === RetureCode.Resource_Not_Found) {
                dispatch(fetchBlog(null));
            } else {
                dispatch(fetchBlog(res.data.blog));
            }
        });
    };
};

// * 发表博客
const addBlog = blog => ({
    type: ADD_ITEM,
    blog
});

const createBlog = blog => {
    return dispatch => {
        return Blogs.create(blog).then(res => {
            if (res.code === RetureCode.Success) {
                dispatch(addBlog(res.data.blog));
                history.push(`/blog/${res.data.blog.id}`);
            }
        });
    };
};

export {
    getBlogs,
    getBlog,
    createBlog
};