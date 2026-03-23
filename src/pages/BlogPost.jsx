import { useParams } from "react-router-dom";
import blogPosts from "../data/blog";

const BlogPost = () => {
    const { slug } = useParams();

    const post = blogPosts.find(p => p.slug === slug);

    if (!post || !post.component) {
        return (
            <div className="text-center py-20">
                Blog not found
            </div>
        );
    }

    const Component = post.component;

    return <Component />;
}

export default BlogPost;