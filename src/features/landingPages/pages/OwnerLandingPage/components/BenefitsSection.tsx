import {ChartBarIcon, CurrencyRupeeIcon, BuildingOfficeIcon} from '@heroicons/react/24/outline';

const BenefitsSection = () => (
  <section className="py-20 px-4 bg-white">
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Increase Revenue by <span className="text-purple-600">35%</span> in
            90 Days
          </h2>
          <div className="space-y-6">
            {[
              {
                metric: "Higher Occupancy Rates",
                description:
                  "Smart pricing algorithms and tenant matching increase occupancy by 25%",
                icon: <ChartBarIcon className="w-6 h-6 text-green-600" />,
              },
              {
                metric: "Faster Rent Collection",
                description:
                  "Automated systems reduce collection time from 15 days to 3 days",
                icon: <CurrencyRupeeIcon className="w-6 h-6 text-blue-600" />,
              },
              {
                metric: "Reduced Operating Costs",
                description:
                  "Automation cuts administrative costs by 40% and maintenance costs by 30%",
                icon: (
                  <BuildingOfficeIcon className="w-6 h-6 text-purple-600" />
                ),
              },
            ].map((benefit, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {benefit.metric}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-purple-900 mb-6">
            Success Story
          </h3>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                RK
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Rajesh Kumar</h4>
                <p className="text-gray-600">Owns 3 PGs in Bangalore</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4 italic">
              "Purple PG transformed my business. Revenue increased by
              ₹2.5L/month, and I save 20 hours weekly. The automated rent
              collection alone pays for the platform."
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">35%</div>
                <div className="text-sm text-gray-600">Revenue Increase</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">95%</div>
                <div className="text-sm text-gray-600">Occupancy Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">20h</div>
                <div className="text-sm text-gray-600">Time Saved/Week</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default BenefitsSection;