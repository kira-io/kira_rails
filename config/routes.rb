Rails.application.routes.draw do
  resources :users
  resources :sessions, only: [:new, :create, :destroy]
  resources :entries, except: [:edit, :update]
  resources :posts, except: [:edit] do 
    resources :messages, except: [:edit, :update]
  end

  # posts
  get "/get_posts" => "posts#get_posts"
  post "/update_post" => "posts#update_post"

  # messages
  get "/get_messages" => "messages#get_messages"

  # show world with posts
  get "/world" => "sessions#world"
  get "/location_json" => "posts#location_json"

  # user friendly routes
  get '/register' => 'users#new'
  get '/signin' => 'sessions#new'
  get '/signout' => 'sessions#destroy'
  root "sessions#new"
end
