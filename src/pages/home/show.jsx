import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Viewer } from '@toast-ui/react-editor';
import { Typography } from "antd";
import dayjs from 'dayjs';
import websiteConfig from '@/config/website';

import { getBlog } from './store/action';

import '@toast-ui/editor/dist/toastui-editor.css';
// import 'Assets/styles/markdown.css';
import styles from './show.module.scss';

const { Title, Paragraph } = Typography;

const BlogShow = props => {

    const { current } = props;
    const { fetchBlog } = props;
    const [isNotPersent, setIsNotPersent] = useState(false);
    const { id } = useParams();
    const viewerRef = useRef(null);

    // ! 我只希望组件挂载的时候执行一次拉取方法，但再useEffect中申明[]依赖却引起了webpack编译的warning提示
    // ! 不声明[]时更离谱，会一直调用fetchBlog
    useEffect(() => {
        fetchBlog(id);
    }, [id, fetchBlog]);

    useEffect(() => {
        if (current === null) {
            setIsNotPersent(true);
        } else {
            current && viewerRef.current.getInstance().setMarkdown(current.content);
        }
    }, [current]);

    return (
        <>
            {
                isNotPersent ?
                    <h1>资源不存在...</h1> :
                    current ?
                        <>
                            <Helmet>
                                <title>{`${current.title} | ${websiteConfig.name}`}</title>
                                <meta name="description" content={`${current.title} | ${websiteConfig.name}`} />
                            </Helmet>
                            <Typography className={styles['blog']}>
                                <Title>{current.title}</Title>
                                <Paragraph>发布时间：{dayjs(current.createdAt).format('YYYY年MM月DD日 HH:mm:ss')}</Paragraph>
                                <Viewer
                                    ref={viewerRef}
                                    initialValue={current.content}
                                    previewStyle="vertical"
                                    height="auto"
                                    initialEditType="markdown"
                                    useCommandShortcut={true}
                                    hideModeSwitch={true}
                                    viewer={true}
                                />
                            </Typography>
                        </> :
                        <h1>加载中...</h1>
            }
        </>
    );
};

const mapStateToProps = (state, ownProps) => ({
    current: state.home.list.filter(item => {
        // ? 资源不存在时，current为null
        // ? 资源正在加载时，则current为空对象{}
        return item === null ? [item] : (parseInt(item.id) === parseInt(ownProps.match.params.id))
    })[0]
});

const mapDispatchToProps = dispatch => ({
    fetchBlog(id) {
        dispatch(getBlog(id));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(BlogShow);