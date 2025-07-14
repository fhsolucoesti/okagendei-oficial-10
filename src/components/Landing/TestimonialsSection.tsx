
import React from 'react';
import { Star } from 'lucide-react';
import { useLandingConfig } from '@/contexts/LandingConfigContext';

const TestimonialsSection = () => {
  const { testimonials } = useLandingConfig();
  
  // Filtrar apenas depoimentos ativos
  const activeTestimonials = testimonials.filter(testimonial => testimonial.isActive !== false);

  if (activeTestimonials.length === 0) {
    return null; // Não renderizar a seção se não há depoimentos ativos
  }

  return (
    <section id="testimonials" className="py-12 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-xl text-gray-600">
            Transformamos negócios todos os dias
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "{testimonial.text || testimonial.testimonial}"
              </p>
              <div className="flex items-center">
                {testimonial.image && (
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.business || testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
