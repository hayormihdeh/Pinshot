import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { FaHeart } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";



export default function PinCard({_id, title, image}) {
  return (
    <>
     <div className="cardBox w-100 h-auto rounded-4 mb-0">
        <Link to = {`/pin/${_id}`}>
            <LazyLoadImage 
            effect = "blur"
            src = {image[0]}
            className="w-100 h-100 rounded-4 object-fit-cover"
            alt = {title}
            title = {title}
            />
        </Link>

        <div className="d-none d-xl-block focus-heart p-2">
        <FaHeart color = "white"/>
        </div>
        
        <div className="d-none d-xl-block focus-download p-2">
        <IoMdDownload color = "white"/>
        </div>
    </div>
    <p className="fw-medium">
      {title?.length > 50 ? title.slice(0, 25) + "..." : title}
    </p>
    </>
   
  )
}

PinCard.propTypes = {
  _id : PropTypes.string,
  title : PropTypes.string,
  image: PropTypes.string
}
