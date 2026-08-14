<section className="bg-[#121212] text-white">
  <div className="max-w-[1440px] mx-auto px-8 lg:px-12">

    {/* Hero */}
    <div className="grid lg:grid-cols-2 gap-24 items-center pt-24 pb-32">
      {/* Left */}
      ...
      {/* Right */}
      ...
    </div>

    {/* Popular Tools */}
    <div className="pt-10 pb-32">

      <div className="text-center mb-16">
        <h2 className="text-6xl font-bold">
          Popular Image Tools
        </h2>

        <p className="text-xl text-gray-400 mt-4">
          Everything you need to edit images online.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
        {tools.map((tool) => (
          <ToolCard key={tool.title} {...tool} />
        ))}
      </div>

    </div>

  </div>
</section>