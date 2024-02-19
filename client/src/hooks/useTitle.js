import { useEffect, useRef } from "react"

export default function useTitle(title) {
    const documentDefined = typeof document !== "undefined"
    const originalTitle = useRef(documentDefined ? document.title : null)

    useEffect(() => {
        if(!documentDefined) return 
        const previousTitle = originalTitle.current
        if(document.title !== title) document.title = title
        return () => {
            document.title = previousTitle
        }
    }, [documentDefined, title])
}
