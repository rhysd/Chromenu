ignore /^node_modules/

def timestamp(file)
  puts "\033[93m#{Time.now}: #{file}\033[0m"
end

def npm_run(task)
  cmd = "npm run #{task}"
  puts cmd
  success = system cmd
  puts (
    if success
      "\033[92mOK\033[0m\n\n"
    else
      "\033[91mFAIL\033[0m\n\n"
    end
  )
  success
end

guard :shell do
  watch %r[^main/.+\.ts$] do |m|
    timestamp m[0]
    npm_run 'build:main'
  end

  watch %r[^renderer/.+\.tsx?$] do |m|
    timestamp m[0]
    npm_run 'build:renderer'
  end

  watch %r[^bin/.+\.ts$] do |m|
    timestamp m[0]
    npm_run 'build:bin'
  end
end
