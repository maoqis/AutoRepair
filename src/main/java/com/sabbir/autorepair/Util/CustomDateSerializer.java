package com.sabbir.autorepair.Util;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.logging.Logger;

public class CustomDateSerializer extends StdSerializer<Date> {
    private static final Logger logger = Logger.getLogger(CustomDateSerializer.class.getName());
    private SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");

    public CustomDateSerializer(Class<Date> t) {
        super(t);
    }

    public CustomDateSerializer() {
        this(null);
    }

    @Override
    public void serialize(Date value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        gen.writeString(simpleDateFormat.format(value));
    }
}
