require 'rails_helper'

RSpec.describe UsersController, :type => :controller do
  describe 'routing' do
    it 'routes to #index' do
      expect(get: '/users').to route_to(controller: 'users', action: 'index')
    end

    it 'routes to #new' do
      expect(get: '/register').to route_to(controller: 'users', action: 'new')
    end

    it 'routes to #show' do
      expect(get: '/users/1').to route_to(controller: 'users', action: 'show', id: '1')
    end

    it 'routes to #edit' do
      expect(get: '/users/1/edit').to route_to(controller: 'users', action: 'edit', id: '1')
    end

    it 'routes to #create' do
      expect(post: '/users').to route_to(controller: 'users', action: 'create')
    end

    it 'routes to #update' do
      expect(patch: '/users/1').to route_to(controller: 'users', action: 'update', id: '1')
    end

    it 'routes to #destroy' do
      expect(delete: '/users/1').to route_to(controller: 'users', action: 'destroy', id: '1')
    end
  end
end
