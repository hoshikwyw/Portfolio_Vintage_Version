import Lottie from 'lottie-react'
import React from 'react'
import animationData from '../../assets/404.json'

const ErrorPage = () => {
    return (
        <div className='w-full h-full flex flex-col justify-center items-center gap-4'>
            <div className="w-64 h-64">
                <Lottie animationData={animationData} loop={true} />
            </div>
            <p className='text-sm text-gray-400'>
                Unfortunately This Page Is Not Available
            </p>
            <p className='text-xs text-gray-500'>
                Developer is Sleeping
            </p>
        </div>
    )
}

export default ErrorPage