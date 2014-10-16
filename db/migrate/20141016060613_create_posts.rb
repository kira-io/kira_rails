class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.string :title
      t.text :content
      t.string :name
      t.string :location
      t.integer :joys
      t.references :user, index: true

      t.timestamps
    end
  end
end
