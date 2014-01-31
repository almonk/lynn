lynn
====

A little link shortener written in NodeJs for http://almonk.com

### Get it running:

Start redis then;

<code>
   npm install<br>
   node app 
</code>

### Use it

Say we want to shorten <code>gocardless.com</code>...

<pre>http://almonk.com/shorten?url=http://gocardless.com</pre>

Returns:

```json
{
   shortened_url: "http://almonk.com/9Aee0",
   edit_token: "Sg9BdkdXTtl1TomlS8s1k7" // Not implemented yet
}
```


