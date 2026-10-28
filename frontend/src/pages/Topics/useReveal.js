import { useEffect } from 'react'

export function useReveal(dep) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (items) =>
        items.forEach((item) => {
          if (item.isIntersecting) {
            item.target.classList.add('topic-visible')
            observer.unobserve(item.target)
          }
        }),
      { threshold: 0.09, rootMargin: '0px 0px -36px 0px' },
    )
    const elements = document.querySelectorAll('.topic-reveal')
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [dep])
}
