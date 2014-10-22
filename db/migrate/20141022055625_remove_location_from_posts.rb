class RemoveLocationFromPosts < ActiveRecord::Migration
  def change
    remove_column :posts, :location, :string
  end
end
