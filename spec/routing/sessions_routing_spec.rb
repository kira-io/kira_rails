require 'rails_helper'

RSpec.describe SessionsController, :type => :controller do
  describe 'routing' do
    it 'routes to #new' do
      expect(get: '/signin').to route_to(controller: 'sessions', action: 'new')
    end

    it 'routes to #create' do
      expect(post: '/sessions').to route_to(controller: 'sessions', action: 'create')
    end

    it 'routes to #destroy' do
      expect(get: '/signout').to route_to(controller: 'sessions', action: 'destroy')
    end
  end
end
