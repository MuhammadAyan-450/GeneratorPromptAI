import blogPosts from "../data/blog";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const Blog = () => {
    return (
        <>
        <Navbar />
            <div className="max-w-7xl mx-auto px-5 py-16">

                <h1 className="text-4xl font-bold text-center mb-14">
                    AI Tools Blog & Guides
                </h1>

                <div className="grid md:grid-cols-3 gap-8">

                    {blogPosts.map((post, i) => (
                        <Link
                            key={i}
                            to={`/blog/${post.slug}`}
                            className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all group"
                        >

                            <div className={`h-52 bg-gradient-to-br ${post.gradient} flex items-center justify-center text-7xl`}>
                                {post.emoji}
                            </div>

                            <div className="p-6">
                                <h3 className="font-bold text-xl mb-3 group-hover:text-indigo-600">
                                    {post.title}
                                </h3>

                                <p className="text-gray-600 mb-4">
                                    {post.desc}
                                </p>

                                <span className="text-indigo-600 flex items-center gap-2">
                                    Read Article <ArrowRight size={18} />
                                </span>
                            </div>

                        </Link>
                    ))}

                </div>

            </div>
            <Footer />
        </>
    );
}

export default Blog;