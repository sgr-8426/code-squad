import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Skill Swap Platform</h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">Exchange skills, grow together, and build meaningful connections in our community of learners and experts.</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Join Now</button>
              <button className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600">Browse Skills <span aria-hidden="true">→</span></button>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Start Learning Today</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How It Works</p>
            <p className="mt-6 text-lg leading-8 text-gray-600">Three simple steps to start your skill-sharing journey.</p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {/* Step 1 */}
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="rounded-lg bg-indigo-600 p-2 ring-1 ring-indigo-600">
                    <span className="text-white">1</span>
                  </div>
                  Create Profile
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Sign up and list your skills and what you want to learn from others.</p>
                </dd>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="rounded-lg bg-indigo-600 p-2 ring-1 ring-indigo-600">
                    <span className="text-white">2</span>
                  </div>
                  Find Matches
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Browse and connect with users who match your skill interests.</p>
                </dd>
              </div>
              
              {/* Step 3 */}
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="rounded-lg bg-indigo-600 p-2 ring-1 ring-indigo-600">
                    <span className="text-white">3</span>
                  </div>
                  Start Learning
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Schedule sessions and begin exchanging skills with your matches.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App