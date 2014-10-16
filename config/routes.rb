Rails.application.routes.draw do
  resources :users
  resources :sessions, only: [:new, :create, :destroy]
  resources :entries, except: [:edit, :update]
  resources :posts, except: [:edit, :update] do 
    resources :messages, except: [:edit, :update]
  end

  #user messages
  get "/users_messages" => "users#messages"

  # user friendly routes
  get '/register' => 'users#new'
  get '/signin' => 'sessions#new'
  get '/signout' => 'sessions#destroy'
  root "sessions#new"
end
